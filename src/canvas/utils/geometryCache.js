/**
 * Geometry Cache (MEMORY OPTIMIZATION)
 * ------------------------------------
 * Three.js objects (BoxGeometry, CylinderGeometry) take up GPU memory.
 * If we render 1000 identical items, creating 1000 geometries would crash the tab.
 * 
 * This file implements a singleton cache pattern. If a geometry of a specific
 * width/height/depth is requested, it is created ONCE, cached here, and reused
 * across all instances in the scene.
 */
import * as THREE from 'three';

const geometries = {};
const materials = {};

export function getBoxGeometry(w, h, d) {
  const key = `box_${w}_${h}_${d}`;
  if (!geometries[key]) {
    geometries[key] = new THREE.BoxGeometry(w, h, d);
  }
  return geometries[key];
}

export function getCylinderGeometry(rt, rb, h, rs) {
  const key = `cyl_${rt}_${rb}_${h}_${rs}`;
  if (!geometries[key]) {
    geometries[key] = new THREE.CylinderGeometry(rt, rb, h, rs);
  }
  return geometries[key];
}

export function getPlaneGeometry(w, h) {
  const key = `plane_${w}_${h}`;
  if (!geometries[key]) {
    geometries[key] = new THREE.PlaneGeometry(w, h);
  }
  return geometries[key];
}

