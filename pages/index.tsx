import type { NextPage } from "next";
import { useSession } from "next-auth/client";
import Head from "next/head";
import Image from "next/image";

const Home: NextPage = () => {
  const [session] = useSession();

  return <>uwu</>;
};

export default Home;
