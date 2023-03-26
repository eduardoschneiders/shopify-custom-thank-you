# frozen_string_literal: true

class Api::MessagesController < AuthenticatedController
  before_action :find_message, only: [:show, :update, :destroy, :activate]
  skip_before_action :verify_authenticity_token, only: [:create]

  def index
    messages = Message.all.map do |message|
      response_object(message)
    end

    render(json: messages)
  end

  def show
    render(json: response_object(@message))
  end

  def update
    @message.update(permitted_params)

    render(json: response_object(@message))
  end

  def create
    message = Message.create(permitted_params)

    render(json: response_object(message))
  end

  def destroy
    @message.destroy
  end

  private

  def response_object(message)
    {
      id: message.id,
      message: message.message,
      secondary_message: message.secondary_message,
      image_url: message.image_url,
      active: message.active,
      createdAt: message.created_at.to_s
    }
  end

  def permitted_params
    params.permit(:message, :secondary_message, :image_url)
  end

  def find_message
    @message ||= Message.find(params[:id])
  end
end
