class SymbolicEngine:
    def __init__(self):
        self.equivalences = {}  # e.g. {"ã¥": "∴", "¥ã": "Δ"}
        self.implications = []  # e.g. [("∴", "Δ")]

    def add_equivalence(self, symbol: str, meaning: str):
        self.equivalences[symbol] = meaning

    def add_implication(self, premise: str, conclusion: str):
        self.implications.append((premise, conclusion))

    def interpret(self, symbol: str) -> str:
        return self.equivalences.get(symbol, "")

    def reverse(self, symbol: str) -> str:
        return symbol[::-1]

    def check_contradiction(self, symbol: str, meaning: str) -> bool:
        existing = self.equivalences.get(symbol)
        return existing is not None and existing != meaning

    def implication_chain(self) -> list:
        return [f"({p}) ⊃ ({c})" for p, c in self.implications]
