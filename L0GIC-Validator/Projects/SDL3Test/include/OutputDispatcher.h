#include "../include/OutputDispatcher.h"
#include <iostream>

void dispatchResult(bool isValid, double entropy) {
    std::cout << "Validation: " << (isValid ? "PASS" : "FAIL")
              << " | Entropy: " << entropy << std::endl;
}
