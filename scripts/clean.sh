for f in $(dirname "$0")/../assets/*.webp; do
    [ -e "$f" ] || continue
    echo $f
     dwebp "$f" -o "${f%.webp}.png";
     rm $f
done

echo "✅ All images processed."