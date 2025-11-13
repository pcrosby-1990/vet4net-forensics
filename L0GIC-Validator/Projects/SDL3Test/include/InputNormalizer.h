#include "../include/InputNormalizer.h"
#include <algorithm>

std::string normalize(const std::string& raw) {
    std::string result = raw;
    // Remove whitespace and convert to lowercase
    result.erase(remove_if(result.begin(), result.end(), ::isspace), result.end());
    std::transform(result.begin(), result.end(), result.begin(), ::tolower);
    return result;
}
