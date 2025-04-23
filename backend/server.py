from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time
import heapq
import csv

app = FastAPI()

# Allows all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.freq = 0


class TrieAutocomplete:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, phrase, frequency=1):
        node = self.root
# create child if missing, then descend
        for char in phrase:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
        node.freq += frequency

    def _dfs(self, node, prefix, results):
        if node.is_end:
            results.append((node.freq, prefix))
        for char, child in node.children.items():
            self._dfs(child, prefix + char, results)

# Find top‑k phrases in Trie matching prefix
    def suggest(self, prefix, k=5):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return []
            node = node.children[char]
        results = []
        self._dfs(node, prefix, results)
        top = heapq.nlargest(k, results)
        return [phrase for freq, phrase in top]


class HashMapAutocomplete:
    def __init__(self):
        self.index = {}

    def insert(self, phrase, frequency=1):
# build every prefix to speed up suggest at cost of memory
        phrase = phrase.lower()
        for i in range(1, len(phrase) + 1):
            prefix = phrase[:i]
            if prefix not in self.index:
                self.index[prefix] = {}
            if phrase not in self.index[prefix]:
                self.index[prefix][phrase] = 0
            self.index[prefix][phrase] += frequency

    def suggest(self, prefix, k=5):
        prefix = prefix.lower()
        if prefix not in self.index:
            return []
        results = self.index[prefix].items()
        top = heapq.nlargest(k, results, key=lambda x: x[1])
        return [phrase for phrase, freq in top]


# Read up to 200k queries from TSV file for initial index build
trie_start = time.time()
trie = TrieAutocomplete()
filepath = 'final_dataset.txt'
with open(filepath, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter='\t')
    count = 0
    for row in reader:
        phrase = row['Query'].lower().strip()
        trie.insert(phrase)
        count += 1
        if count >= 200000:
            break
trie_end = time.time()

hmap_start = time.time()
hmap = HashMapAutocomplete()
with open(filepath, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter='\t')
    count = 0
    for row in reader:
        phrase = row['Query'].lower().strip()
        hmap.insert(phrase)
        count += 1
        if count >= 200000:
            break
hmap_end = time.time()


@app.get("/program_data")
def data():
    return {
        "hashmap_build_time": hmap_end - hmap_start,
        "trie_build_time": trie_end - trie_start
    }

@app.get("/suggest")
def suggest(prefix: str, algorithm: str, k: int = 5):
    start = time.perf_counter()
    if algorithm == "trie":
        results = trie.suggest(prefix.lower(), k)
    else:
        results = hmap.suggest(prefix.lower(), k)
    end = time.perf_counter()
    return {"results": results, "elapsed_time": (end - start) * 1000}  # in ms
