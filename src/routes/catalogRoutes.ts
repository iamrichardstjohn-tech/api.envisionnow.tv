import { Router } from 'express';

export const catalogRouter = Router();

const catalog = [
  {
    id: '32-degreez-s1',
    title: '32° Degreez',
    type: 'series',
    status: 'coming_soon',
    season: 1,
    subtitle: 'The Art of Redemption',
    destination: 'https://32-degreez.com',
  },
];

const brandDestinations = [
  { id: 'envision-media', name: 'Envision Media', status: 'active' },
  { id: 'rsj', name: 'RSJ Luxury Collection', status: 'coming_soon', destination: 'https://richardstjohn.shop' },
];

catalogRouter.get('/', (req, res) => {
  res.json({ ok: true, catalog, brands: brandDestinations, requestId: req.requestId });
});

catalogRouter.get('/:id', (req, res) => {
  const item = catalog.find((entry) => entry.id === req.params.id);
  if (!item) {
    res.status(404).json({ ok: false, error: 'catalog_item_not_found', requestId: req.requestId });
    return;
  }
  res.json({ ok: true, item, requestId: req.requestId });
});
