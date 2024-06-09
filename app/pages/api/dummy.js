export default function handler(req, res) {
    if (req.method === 'GET') {
      res.status(200).json({
        userId: 1,
        id: 1,
        title: 'Dummy Title',
        body: 'This is a dummy response.',
      });
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  