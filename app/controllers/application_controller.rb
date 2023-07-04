class ApplicationController < ActionController::Base
  rescue_from ActiveRecord::RecordNotFound, with: :render_404

  def render_404
    respond_to do |format|
      format.html { render file: 'public/404.html', status: 404, layout: false }
    end
  end
end
