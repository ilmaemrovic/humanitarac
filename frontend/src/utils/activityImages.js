// Map activity IDs and categories to images
const activityImageMap = {
  a1: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop',
  a2: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&h=400&fit=crop',
  a3: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=400&fit=crop',
  a4: 'https://images.unsplash.com/photo-1558008258-3256797b43f3?w=600&h=400&fit=crop',
  a5: 'https://images.unsplash.com/photo-1516728778615-2d590ea1855e?w=600&h=400&fit=crop',
  a6: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop',
  a7: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop',
  a8: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=400&fit=crop',
  a9: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=400&fit=crop',
  a10: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
}

// Fallback images by category
const categoryFallback = {
  'Pomoć': 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=400&fit=crop',
  'Edukacija': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
  'Krizna pomoć': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop',
  'Volontiranje': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop',
}

const defaultImage = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=400&fit=crop'

export function getActivityImage(activity) {
  if (!activity) return defaultImage
  return activityImageMap[activity.id] || categoryFallback[activity.category] || defaultImage
}
