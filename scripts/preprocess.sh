MAX_JOBS=2
job_count=0

for img in $(dirname "$0")/../assets/*; do
    [ -e "$img" ] || continue

    filename=$(basename "$img")
    echo "Processing $filename..."
    
    mkdir -p /tmp/garden-sketch
    tmp="/tmp/garden-sketch/${filename%.*}"

    scripts_dir=$(dirname "$0")
    parent_dir=$scripts_dir/..
    out="$parent_dir/public/illustrations/${filename%.*}.svg"

    (
        rembg i -m "birefnet-general-lite" "$img" "$tmp.png" > /dev/null || echo "❌ Error removing background from $filename"

        vtracer \
            --colormode color \
            --preset poster \
            --hierarchical stacked \
            -p 8 \
            -g 16 \
            --mode spline \
            -c 60 \
            -f 10 \
            -l 8 \
            -s 45 \
            --path_precision 2 \
            -i "$tmp.png" -o $(dirname "$0")/../public/illustrations/${filename%.*}.svg \
            > /dev/null || echo "❌ Error processing $filename"
    
        inkscape \
            --export-plain-svg \
            -D "$out" \
            -o "$out"
    
        svgo "$out" --multipass --quiet
    ) &

    ((job_count++))

    # Control parallelism
    if (( job_count >= MAX_JOBS )); then
        wait
        job_count=0
    fi
done

wait
echo "✅ All images processed."
