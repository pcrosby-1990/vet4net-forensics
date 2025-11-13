self.notebook = ttk.Notebook(self.root)
self.notebook.pack(fill="both", expand=True)

self.tab_stamp = tk.Frame(self.notebook)
self.tab_batch = tk.Frame(self.notebook)
self.tab_registry = tk.Frame(self.notebook)
self.tab_audit = tk.Frame(self.notebook)

self.notebook.add(self.tab_stamp, text="Stamp & Sign")
self.notebook.add(self.tab_batch, text="Batch Mode")
self.notebook.add(self.tab_registry, text="Registry")
self.notebook.add(self.tab_audit, text="Audit Log")
