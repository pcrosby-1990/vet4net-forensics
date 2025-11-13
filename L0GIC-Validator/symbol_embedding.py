import os
import numpy as np
from PIL import Image
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt

GLYPH_DIR = "glyphs/train"
IMAGE_SIZE = (64, 64)
EMBED_PATH = "glyph_embeddings.npy"
PLOT_PATH = "assets/embedding_plot.png"

# Inside symbol_embedding.py
for realm in ["emotion", "meta", "action", "system"]:
    glyphs, names = load_glyphs(realm_filter=realm)
    reduced = PCA(n_components=2).fit_transform(glyphs)
    save_plot(reduced, names, f"embedding_{realm}.png")
    
with st.expander("🧠 Realm Embeddings"):
    for realm in ["emotion", "meta", "action", "system"]:
        path = f"assets/embedding_{realm}.png"
        if os.path.exists(path):
            st.image(path, caption=f"{realm.capitalize()} Realm Embedding")


def load_glyphs():
    glyphs, names = [], []
    for fname in sorted(os.listdir(GLYPH_DIR)):
        if fname.endswith(".png"):
            path = os.path.join(GLYPH_DIR, fname)
            img = Image.open(path).convert("L").resize(IMAGE_SIZE)
            vec = np.array(img).flatten() / 255.0
            glyphs.append(vec)
            names.append(fname)
    return np.array(glyphs), names

def embed_and_plot():
    glyphs, names = load_glyphs()
    pca = PCA(n_components=2)
    reduced = pca.fit_transform(glyphs)
    np.save(EMBED_PATH, reduced)

    plt.figure(figsize=(8, 6))
    plt.scatter(reduced[:, 0], reduced[:, 1], s=10, alpha=0.7)
    plt.title("Symbolic Embedding Space")
    plt.xlabel("PC1")
    plt.ylabel("PC2")
    plt.tight_layout()
    plt.savefig(PLOT_PATH)
    print(f"✅ Saved embedding plot to {PLOT_PATH}")

if __name__ == "__main__":
    embed_and_plot()
