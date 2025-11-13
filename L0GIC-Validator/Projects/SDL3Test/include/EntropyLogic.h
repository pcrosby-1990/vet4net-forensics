#include "../include/EntropyLogic.h"
#include <cmath>
#include <map>

double calculateEntropy(const std::string& data) {
    std::map<char, int> freq;
    for (char c : data) freq[c]++;

    double entropy = 0.0;
    for (const auto& [ch, count] : freq) {
        double p = static_cast<double>(count) / data.length();
        entropy -= p * std::log2(p);
    }
    return entropy;
}
