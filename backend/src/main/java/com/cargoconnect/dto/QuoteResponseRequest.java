package com.cargoconnect.dto;

import jakarta.validation.constraints.NotBlank;

public class QuoteResponseRequest {
    @NotBlank(message = "Response action is required: ACCEPTED, REJECTED, or NEGOTIATE")
    private String response; // ACCEPTED, REJECTED, NEGOTIATE

    private String notes;


    // --- Standard Constructors ---
    public QuoteResponseRequest() {}

    public QuoteResponseRequest(String response, String notes) {
        this.response = response;
        this.notes = notes;
    }


    // --- Getters & Setters ---
    public String getResponse() { return this.response; }
    public void setResponse(String response) { this.response = response; }
    public String getNotes() { return this.notes; }
    public void setNotes(String notes) { this.notes = notes; }


    // --- Builder Pattern ---
    public static QuoteResponseRequestBuilder builder() {
        return new QuoteResponseRequestBuilder();
    }

    public static class QuoteResponseRequestBuilder {
        private String response;
        private String notes;

        public QuoteResponseRequestBuilder() {}

        public QuoteResponseRequestBuilder response(String response) {
            this.response = response;
            return this;
        }

        public QuoteResponseRequestBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public QuoteResponseRequest build() {
            QuoteResponseRequest instance = new QuoteResponseRequest();
            instance.response = this.response;
            instance.notes = this.notes;
            return instance;
        }
    }

}
