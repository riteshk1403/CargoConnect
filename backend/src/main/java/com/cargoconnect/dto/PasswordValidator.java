package com.cargoconnect.dto;

import java.util.regex.Pattern;

public class PasswordValidator {
    // Requires >= 6 chars, >= 1 digit, >= 1 lower, >= 1 upper, >= 1 special char
    private static final String PASSWORD_PATTERN = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!._\\-\\*\\(\\)\\[\\]\\{\\}~`|:;\"'<>,?/]).{6,}$";
    private static final Pattern PATTERN = Pattern.compile(PASSWORD_PATTERN);

    public static boolean isValid(String password) {
        if (password == null) {
            return false;
        }
        return PATTERN.matcher(password).matches();
    }

    public static String getRequirementsMessage() {
        return "Password must contain at least: 6 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.";
    }
}
