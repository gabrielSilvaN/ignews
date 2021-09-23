import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  return res.json([
    { name: "Gabriel", age: 25 },
    { name: "Kaio", age: 22 },
  ])
};

export default handler;
