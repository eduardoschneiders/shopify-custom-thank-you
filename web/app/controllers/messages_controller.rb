# frozen_string_literal: true

class MessagesController < AuthenticatedController
  before_action :find_message, only: [:show, :update, :delete]

  def index
    messages = Message.all.map do |message|
      { id: message.id, message: message.message, createdAt: message.created_at }
    end

    render(json: messages)
  end

  def show
    render(json: { id: @message.id, message: @message.message, createdAt: @message.created_at })
  end

  def update
    @message.update(params.permit(:message))

    render(json: { id: @message.id, message: @message.message, createdAt: @message.created_at })
  end

  def delete
    @message.destroy
  end

  def find_message
    @message ||= Message.find(params[:id])
  end
end
