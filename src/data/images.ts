export function unsplash(id: string, width = 1600) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export const images = {
  hero: unsplash("photo-1414235077428-338989a2e8c0", 2400),
  storyPrimary: unsplash("photo-1596040033229-a9821ebd058d"),
  storySecondary: unsplash("photo-1509358271058-acd22cc93898", 1200),
  chef: unsplash("photo-1577219491135-ce391730fb2c"),
  chefFire: unsplash("photo-1600565193348-f74bd3c7ccdf", 1200),
  grillFire: unsplash("photo-1555939594-58d7cb561ad1", 2000),
  dubai: unsplash("photo-1512453979798-5ea266f8880c", 2000),
  feast: unsplash("photo-1600891964599-f61ba0e24092", 2000),
  eventsHero: unsplash("photo-1559339352-11d035aa65de", 2400),
  reservationsHero: unsplash("photo-1552566626-52f8b828add9", 2000),
  menuHero: unsplash("photo-1504674900247-0877df9cc836", 2400),
  checkoutAside: unsplash("photo-1606491956689-2ea866880c84", 1200),
} as const;
