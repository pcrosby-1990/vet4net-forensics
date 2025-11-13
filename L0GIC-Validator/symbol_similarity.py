import os
import numpy as np
from PIL import Image
from sklearn.metrics.pairwise import cosine_similarity
import matplotlib.pyplot as plt

# === Config ===
GLYPH_DIR = "glyphs/train"
IMAGE_SIZE = (64, 64)
SIM_MATRIX_PATH = "similarity_matrix.npy"
NAME_LIST_PATH = "glyph_names.npy"
VISUAL_PATH = "similarity_matrix.png"

# === Load Glyphs ===
def load_glyphs():
    glyphs = []
    names = []
    for fname in sorted(os.listdir(GLYPH_DIR)):
        if fname.endswith(".png"):
            path = os.path.join(GLYPH_DIR, fname)
            img = Image.open(path).convert("L").resize(IMAGE_SIZE)
            vec = np.array(img).flatten() / 255.0
            glyphs.append(vec)
            names.append(fname)
    return np.array(glyphs), names

# === Compute Similarity Matrix ===
def compute_similarity_matrix(glyphs):
    return cosine_similarity(glyphs)

# === Save Matrix and Names ===
def save_similarity(sim_matrix, names):
    np.save(SIM_MATRIX_PATH, sim_matrix)
    np.save(NAME_LIST_PATH, np.array(names))
    print(f"✅ Saved similarity matrix to {SIM_MATRIX_PATH}")
    print(f"✅ Saved glyph names to {NAME_LIST_PATH}")

# === Plot Matrix ===
def plot_similarity(sim_matrix):
    plt.figure(figsize=(10, 10))
    plt.imshow(sim_matrix, cmap="viridis")
    plt.title("Glyph Similarity Matrix")
    plt.colorbar()
    plt.xticks([])
    plt.yticks([])
    plt.tight_layout()
    plt.savefig(VISUAL_PATH)
    print(f"✅ Saved similarity matrix visualization to {VISUAL_PATH}")

# === Get Top Neighbors (for Streamlit use) ===
def get_top_neighbors(sim_matrix, names, target_index, top_n=5):
    scores = sim_matrix[target_index]
    indices = np.argsort(scores)[::-1][1:top_n+1]
    return [(names[i], scores[i]) for i in indices]

# === Main Execution ===
if __name__ == "__main__":
    glyphs, names = load_glyphs()
    sim_matrix = compute_similarity_matrix(glyphs)
    save_similarity(sim_matrix, names)
    plot_similarity(sim_matrix)
