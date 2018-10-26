class RepositoriesController < ApplicationController
  before_action :authenticate_user!

  def index
    # Call Github api to get users repositories
    @repositories = Github.new.repos.list(user: current_user.username)
  end

  def show
    set_date_rage
    github = Github.new
    @repo = github.repos.get_by_id(params[:id])
    if @repo.nil?
      redirect_to repositories_path, alert: 'Repo not found.' if @repo.nil?
    else
      commits = github.repos.commits.list current_user.username, @repo.name, since: @start_date, until: @end_date 
      @commits_arr = commits.map(&:commit).map(&:author).group_by{ |d| DateTime.parse(d.date).strftime('%d-%m-%y') }.map{ |k,v| [k, v.length] }
    end
  end

  private
  def set_date_rage
    # Set Date range for commits history
    if params[:daterange]
      @start_date = params[:daterange].split[0]
      @end_date = params[:daterange].split[1]
    else
      @start_date = (Time.now - 1115.day).beginning_of_day
      @end_date = Time.now
    end
  end
end