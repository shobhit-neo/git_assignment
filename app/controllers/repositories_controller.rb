class RepositoriesController < ApplicationController
  before_action :authenticate_user!

  def index
    # Call Github api to get users repositories
    @repositories = Github.new.repos.list(user: current_user.username)
  end

  def show
    # Set Date range for commits history
    @start_date = (Time.now - 1115.day).beginning_of_day
    @end_date = Time.now
    
    github = Github.new
    @repo = github.repos.get_by_id(params[:id])
    if @repo.nil?
      redirect_to repositories_path, alert: 'Repo not found.' if @repo.nil?
    else
      commits = github.repos.commits.list current_user.username, @repo.name, since: @start_date, until: @end_date 
      @commits_arr = commits.map(&:commit).map(&:author).group_by{|d| DateTime.parse(d.date).strftime('%d-%m-%y')}.map{|k,v| [k, v.length]}
    end
  end

  def get_commits
    #@start_date = params[:start_date].to_date.beginning_of_day
    #@end_date = params[:end_date].to_date.end_of_day
    @commits = Github.new.repos.commits.list current_user.username, params[:id]#, since: @start_date, until: @end_date
    render json: @commits
  end
end