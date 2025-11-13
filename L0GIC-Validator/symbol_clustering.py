import os
import numpy as np
from PIL import Image
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

GLYPH_DIR = "glyphs/train"
IMAGE_SIZE = (64, 64)
N_CLUSTERS = 6

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

def cluster_and_plot():
    glyphs, names = load_glyphs()
    pca = PCA(n_components=2)
    reduced = pca.fit_transform(glyphs)
    kmeans = KMeans(n_clusters=N_CLUSTERS, random_state=42)
    labels = kmeans.fit_predict(glyphs)

    plt.figure(figsize=(8, 6))
    for i in range(N_CLUSTERS):
        cluster = reduced[labels == i]
        plt.scatter(cluster[:, 0], cluster[:, 1], label=f"Cluster {i}")
    plt.legend()
    plt.title("Symbolic Clustering")
    plt.savefig("assets/cluster_plot.png")
    print("✅ Saved cluster plot to assets/cluster_plot.png")

if __name__ == "__main__":
    cluster_and_plot()
