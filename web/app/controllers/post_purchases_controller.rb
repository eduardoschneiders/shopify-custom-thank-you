# frozen_string_literal: true

class PostPurchasesController < ApplicationController
  def get_message
    @message ||= Message.last

    render(json: { id: @message.id, message: @message.message, createdAt: @message.created_at })
  end
end
