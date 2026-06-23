import cv2
import numpy as np
import json
import sys

def extract_walls(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) if len(img.shape) == 3 else img)
    # Threshold to get black lines
    _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)
    
    # Use HoughLinesP to find line segments
    lines = cv2.HoughLinesP(thresh, 1, np.pi/180, threshold=50, minLineLength=50, maxLineGap=10)
    
    if lines is None:
        return []
        
    extracted_lines = []
    min_x, min_y = float('inf'), float('inf')
    max_x, max_y = -float('inf'), -float('inf')
    
    for line in lines:
        x1, y1, x2, y2 = line[0]
        extracted_lines.append([[float(x1), float(y1)], [float(x2), float(y2)]])
        min_x = min(min_x, x1, x2)
        max_x = max(max_x, x1, x2)
        min_y = min(min_y, y1, y2)
        max_y = max(max_y, y1, y2)
        
    # Scale to room width 34 and depth 28
    # Actually, the user's second.json says width:34, depth:28. Let's pad by 2 meters
    room_w = 34 - 4
    room_d = 28 - 4
    
    scale_x = room_w / (max_x - min_x) if max_x > min_x else 1.0
    scale_y = room_d / (max_y - min_y) if max_y > min_y else 1.0
    
    # Keep aspect ratio? For floorplans, yes.
    scale = min(scale_x, scale_y)
    
    final_walls = []
    for line in extracted_lines:
        nx1 = (line[0][0] - min_x) * scale + 2.0
        ny1 = (line[0][1] - min_y) * scale + 2.0
        nx2 = (line[1][0] - min_x) * scale + 2.0
        ny2 = (line[1][1] - min_y) * scale + 2.0
        final_walls.append([[round(nx1, 3), round(ny1, 3)], [round(nx2, 3), round(ny2, 3)]])
        
    return final_walls

if __name__ == "__main__":
    # The image path is provided by the system implicitly, let's find it.
    # It's usually in /Users/ajendra/Downloads/ or the workspace.
    # Wait, the user attached a PNG to the prompt. 
    # Let's search the workspace for recently added png files.
    pass
