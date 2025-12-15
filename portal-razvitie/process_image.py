from PIL import Image, ImageDraw
import sys
import os

def remove_background_and_artifacts(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    width, height = img.size
    
    # 1. First pass: Remove yellow background (Color Thresholding)
    # We will build a binary mask of "kept" pixels
    temp_data = [] # List of (x, y) that are kept
    
    original_pixels = img.load()
    
    # Create a blank image for the result
    result_img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    result_pixels = result_img.load()
    
    # Visited set for flood fill
    kept_pixels_set = set()
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = original_pixels[x, y]
            
            # Check logic identical to previous: Keep Black (Bird) and White (Eye)
            is_black = r < 90 and g < 90 and b < 90
            is_white = r > 200 and g > 200 and b > 200
            
            if is_black or is_white:
                kept_pixels_set.add((x, y))
    
    # 2. Second pass: Connected Component Analysis to keep only the Bird
    # We find all connected blobs of "kept" pixels and preserve only the largest one.
    
    visited = set()
    largest_blob = set()
    
    def get_blob(start_x, start_y):
        blob = set()
        stack = [(start_x, start_y)]
        visited.add((start_x, start_y))
        blob.add((start_x, start_y))
        
        while stack:
            cx, cy = stack.pop()
            
            # Check 4 neighbors
            for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
                nx, ny = cx + dx, cy + dy
                if (nx, ny) in kept_pixels_set and (nx, ny) not in visited:
                    visited.add((nx, ny))
                    blob.add((nx, ny))
                    stack.append((nx, ny))
        return blob

    blobs = []
    
    # Iterate to find all blobs
    for x, y in kept_pixels_set:
        if (x, y) not in visited:
            current_blob = get_blob(x, y)
            blobs.append(current_blob)
            
    if blobs:
        # Find the largest blob (The Bird)
        main_blob = max(blobs, key=len)
        print(f"Found {len(blobs)} disconnected parts. Keeping largest with {len(main_blob)} pixels.")
        
        # Also keep any blob that is "inside" the bounding box of the main blob?
        # The eye might be disconnected if it is purely white separated by partial transparency?
        # Actually in the logo, the eye is surrounded by black, so it should be connected.
        # But let's verify. If the eye is separate, we might lose it.
        # However, usually the white eye is inside the black head.
        
        # Let's copy the main blob pixels to result
        for bx, by in main_blob:
            result_pixels[bx, by] = original_pixels[bx, by]
            
        # Optional: Check for "Eye" blob if it really is separate (unlikely but possible with anti-aliasing)
        # If there is a large second blob (e.g. > 100 pixels), it might be the eye.
        sorted_blobs = sorted(blobs, key=len, reverse=True)
        if len(sorted_blobs) > 1:
            second_blob = sorted_blobs[1]
            # If second blob is substantial size (e.g. > 5% of main), keep it too
            if len(second_blob) > len(main_blob) * 0.05:
                print(f"Restoring potential detached part (Eye?) with {len(second_blob)} pixels.")
                for bx, by in second_blob:
                    result_pixels[bx, by] = original_pixels[bx, by]

    else:
        print("No bird found!")

    result_img.save(output_path, "PNG")
    print(f"Cleaned image saved to {output_path}")

if __name__ == "__main__":
    source = "/Users/valeriy.izvekov/.gemini/antigravity/brain/f7895f02-b4a0-4486-84e6-0853fd978714/uploaded_image_1765538401058.png"
    dest = "/Users/valeriy.izvekov/Documents/Чижик_Портал ИК/portal-razvitie/public/images/chizhik_transparent.png"
    
    remove_background_and_artifacts(source, dest)
