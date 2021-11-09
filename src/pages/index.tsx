import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";
import styles from "./home.module.scss";

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  };
}

const Home: NextPage<HomeProps> = ({ product }) => {
  return (
    <div>
      <Head>
        <title>Home | ignews</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, Welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>

          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl Coding" />
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1JceyDG8dpXOL6hU8jZD1PbN");

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount ? price.unit_amount / 100 : 0),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24,
  };
};

export default Home;
