# frozen_string_literal: true

class PostPurchasesController < ApplicationController
  def get_message
    message = Message.find_by(active: true) || Message.last

    render(json: response_object(message))
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
end
