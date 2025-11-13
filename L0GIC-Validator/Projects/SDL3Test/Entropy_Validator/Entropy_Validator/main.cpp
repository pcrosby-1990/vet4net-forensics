#include <SDL3/SDL.h>
#include <iostream>
#include <string>
#include "../include/InputNormalizer.h"
#include "../include/EntropyLogic.h"
#include "../include/Validator.h"
#include "../include/OutputDispatcher.h"

int main(int argc, char* argv[]) {
    // Step 1: Get raw input
    std::string rawInput = "entropy_sample_001";

    // Step 2: Normalize input
    std::string normalized = normalize(rawInput);

    // Step 3: Calculate entropy
    double entropy = calculateEntropy(normalized);

    // Step 4: Validate input
    bool isValid = validate(normalized);

    // Step 5: Dispatch result to console
    dispatchResult(isValid, entropy);

    // Step 6: Initialize SDL3
    if (SDL_Init(SDL_INIT_VIDEO) != 0) {
        std::cerr << "SDL_Init Error: " << SDL_GetError() << std::endl;
        return 1;
    }

    // Step 7: Create SDL3 window
    SDL_Window* window = SDL_CreateWindow(
        "Entropy Validator", 640, 480, SDL_WINDOW_OPENGL
    );

    if (!window) {
        std::cerr << "SDL_CreateWindow Error: " << SDL_GetError() << std::endl;
        SDL_Quit();
        return 1;
    }

    // Step 8: Update window title with validation result
    std::string windowTitle = "Result: " + std::string(isValid ? "PASS" : "FAIL") +
                              " | Entropy: " + std::to_string(entropy);
    SDL_SetWindowTitle(window, windowTitle.c_str());

    // Step 9: Keep window open for 3 seconds
    SDL_Delay(3000);

    // Step 10: Clean up
    SDL_DestroyWindow(window);
    SDL_Quit();

    return 0;
}
