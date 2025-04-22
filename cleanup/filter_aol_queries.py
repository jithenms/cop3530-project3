
import argparse
import os
import re
from better_profanity import profanity

NSFW_KEYWORDS = {
    'porn', 'xxx', 'sex', 'erotic', 'adult', 'nsfw', 'nude', 'naked', 'fetish'
}

URL_PATTERN = re.compile(r"\b\S+\.[a-zA-Z]{2,}(?:/\S*)?\b")


def is_nsfw(query: str) -> bool:

    lower = query.lower()
    if profanity.contains_profanity(lower):
        return True
    for word in NSFW_KEYWORDS:
        if word in lower:
            return True
    return False


def clean_query(query: str) -> str:

    return URL_PATTERN.sub('', query).strip()


def process_file(input_path: str, output_path: str) -> None:
    if os.path.abspath(input_path) == os.path.abspath(output_path):
        raise ValueError("Input and output paths must be different. Please specify a different --output path.")

    total = 0
    kept = 0

    try:
        with open(input_path, 'r', encoding='utf-8', errors='ignore') as fin, \
             open(output_path, 'w', encoding='utf-8') as fout:
            for line in fin:
                total += 1
                if not line.strip():
                    continue
                parts = line.rstrip('\n').split('\t')
                if len(parts) < 4:
                    continue
                anon_id, query, query_time, item_rank = parts[:4]

                if is_nsfw(query):
                    continue

                cleaned = clean_query(query)
                if not cleaned:
                    continue

                fout.write(f"{anon_id}\t{cleaned}\t{query_time}\t{item_rank}\n")
                kept += 1

                if total % 1_000_000 == 0:
                    print(f"Processed {total:,} lines, kept {kept:,}...")

    except PermissionError as e:
        print(f"Permission denied: {e.filename}. Please check file permissions or choose a different output path.")
        return

    print(f"Done. Total lines processed: {total:,}. Queries kept: {kept:,}.")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Filter and clean AOL query logs')
    parser.add_argument('--input', '-i', required=True, help='Path to input .txt file')
    parser.add_argument('--output', '-o', required=True, help='Path to write cleaned output')
    args = parser.parse_args()

    profanity.load_censor_words()

    try:
        process_file(args.input, args.output)
    except ValueError as ve:
        print(f"Error: {ve}")
    except Exception as ex:
        print(f"An unexpected error occurred: {ex}")
