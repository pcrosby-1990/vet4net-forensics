#include "../include/Validator.h"
#include "../include/EntropyLogic.h"

bool validate(const std::string& input) {
    double entropy = calculateEntropy(input);
    return entropy > 3.5; // Arbitrary threshold for now
}
