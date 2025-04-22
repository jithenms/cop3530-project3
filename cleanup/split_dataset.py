# File: split_dataset.py

def extract_first_lines(input_file, output_file, num_lines=200000):
    with open(input_file, 'r', encoding='utf-8') as infile, \
         open(output_file, 'w', encoding='utf-8') as outfile:
        
        for i, line in enumerate(infile):
            if i >= num_lines:
                break
            outfile.write(line)

if __name__ == "__main__":
    input_path = 'cleaned_user_queries.txt'    
    output_path = 'final_dataset.txt'  
    extract_first_lines(input_path, output_path)

    print(f"Done! First 200,000 lines saved to {output_path}")
