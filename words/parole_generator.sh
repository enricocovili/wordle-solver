#!/bin/bash

# Check if a filename was provided
if [ -z "$1" ]; then
  echo "Usage: $0 <input_filename>"
  exit 1
fi

input_file="$1"

# Verify the input file exists
if [ ! -f "$input_file" ]; then
  echo "Error: File '$input_file' not found!"
  exit 1
fi

# Create the output files for words of length 4 to 10
for i in {4..10}; do
  output_file="parole_${i}.txt"
  > "$output_file"  # Clear the file if it already exists
done

# Read the input file word by word
while read -r word; do
  word_length=${#word}

  # Check if word length is between 4 and 10
  if (( word_length >= 4 && word_length <= 10 )); then
    output_file="parole_${word_length}.txt"
    echo "$word" >> "$output_file"
  fi
done < <(tr ' ' '\n' < "$input_file")

echo "Files created for words of length 4 to 10"
