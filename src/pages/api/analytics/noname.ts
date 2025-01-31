import { NextApiRequest, NextApiResponse } from 'next';

interface ChartData {
  date: string;
  value: number;
}

const handler = async (req: NextApiRequest, res: NextApiResponse<ChartData[]>) => {
  if (req.method === 'GET') {
    const data: ChartData[] = [
      { date: '2025-01-01', value: 100 },
      { date: '2025-01-02', value: 120 },
      { date: '2025-01-03', value: 150 },
    ];
    res.status(200).json(data);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
