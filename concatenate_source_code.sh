#!/bin/bash

# Set the output file name
output_file="concatenated_source_code.txt"

# Remove the output file if it already exists
rm -f "$output_file"

# List of files to concatenate
files=(
    "./README.md"
    "./src/"
)

# files=(
#     "./python/nestbox/interfaces/aligner_client.py"
#     "./python/nestbox/interfaces/client_server.py"
#     "./python/nestbox/interfaces/communication.py"
#     "./python/nestbox/interfaces/database.py"
#     "./python/nestbox/interfaces/instance_id.py"
#     "./python/nestbox/interfaces/peer_discovery.py"
#     "./python/nestbox/interfaces/visualizer_client.py"
# )

# sort the files
IFS=$'\n' files=($(sort <<<"${files[*]}"))
unset IFS

# put the complete file list at the top of the output. If the files is not found, it will be noted in the output
for file in "${files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "Source file not found: $file" >> "$output_file"
    fi
    echo "$file" >> "$output_file"
done
echo "" >> "$output_file"

# Function to check if a path is in the files list or is a parent directory of a file in the list
is_included() {
    local check_path="$1"
    for file in "${files[@]}"; do
        if [[ "$file" == "$check_path"* ]]; then
            return 0  # Path is included
        fi
    done
    return 1  # Path is not included
}

# Function to generate the file tree
generate_tree() {
    local prefix="$1"
    local path="$2"
    
    # Get all subdirectories in the current path
    local subdirs=($(find "$path" -maxdepth 1 -type d | sort))
    
    # Remove the current directory from the list
    subdirs=("${subdirs[@]:1}")
    
    # Get all files in the current path that are in the list
    local files_in_dir=()
    for file in "${files[@]}"; do
        if [[ "$file" == "$path/"* && "$file" != *"/"* ]]; then
            files_in_dir+=("$file")
        fi
    done
    
    # Combine subdirs and files for sorting
    local all_entries=("${subdirs[@]}" "${files_in_dir[@]}")
    IFS=$'\n' sorted_entries=($(sort <<<"${all_entries[*]}"))
    unset IFS

    local last_entry=""
    if [ ${#sorted_entries[@]} -gt 0 ]; then
        last_entry="${sorted_entries[${#sorted_entries[@]}-1]}"
    fi
    
    for entry in "${sorted_entries[@]}"; do
        if [ -d "$entry" ]; then
            if is_included "$entry"; then
                local dir_name=$(basename "$entry")
                if [[ "$entry" == "$last_entry" ]]; then
                    echo "${prefix}└── $dir_name/" >> "$output_file"
                    generate_tree "${prefix}    " "$entry"
                else
                    echo "${prefix}├── $dir_name/" >> "$output_file"
                    generate_tree "${prefix}│   " "$entry"
                fi
            fi
        else
            local file_name=$(basename "$entry")
            if [[ "$entry" == "$last_entry" ]]; then
                echo "${prefix}└── $file_name" >> "$output_file"
            else
                echo "${prefix}├── $file_name" >> "$output_file"
            fi
        fi
    done
}

# Start generating the tree
echo "./" >> "$output_file"
generate_tree "" "."
echo "" >> "$output_file"
echo "" >> "$output_file"

echo "File tree has been generated in $output_file"

# Function to get the language based on file extension
get_language() {
    case "$1" in
        *.cs)     echo "C#" ;;
        *.py)     echo "Python" ;;
        *.js)     echo "JavaScript" ;;
        *.css)    echo "CSS Style" ;;
        *.proto)  echo "Protocol Buffers" ;;
        *.md)     echo "Markdown" ;;
        *)        echo "Unknown" ;;
    esac
}

# Process each file
for file in "${files[@]}"; do
    # Check if file exists
    if [ ! -f "$file" ]; then
        echo "File not found: $file" >> "$output_file"
        echo "" >> "$output_file"
        continue
    fi

    # Get file information
    file_name=$(basename "$file")
    file_path=$(dirname "$file")
    language=$(get_language "$file")
    lines=$(wc -l < "$file" | tr -d ' ')

    # Append file information and contents to the output file
    echo "===================================================" >> "$output_file"
    echo "File: $file_name" >> "$output_file"
    echo "Path: $file_path" >> "$output_file"
    echo "Language: $language" >> "$output_file"
    echo "Lines: $lines" >> "$output_file"
    echo "===================================================" >> "$output_file"
    echo "" >> "$output_file"
    cat "$file" >> "$output_file"
    echo "" >> "$output_file"
    echo "" >> "$output_file"
done

echo "Concatenation complete. Output file: $output_file"