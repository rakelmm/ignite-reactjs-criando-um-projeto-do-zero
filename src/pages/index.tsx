import { GetStaticProps } from 'next';
import Link from 'next/link';
import Header from '../components/Header';
import { FiCalendar, FiUser } from 'react-icons/fi'
import Prismic from '@prismicio/client';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useState } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/esm/locale/pt-BR/index.js';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const formattedPost = postsPagination.results.map(post => {
    return {
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
    };
  });
  const [posts, setPosts] = useState<Post[]>(
   
  );

  return (
    <>
      <main className={commonStyles.container}>
        <Header />
        <div>
          <Link href="/">
            <a className={styles.post}>
              <strong>Como utilizar Hooks</strong>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <ul>
                <li>
                  <FiCalendar />
                  01 jun 2022
                </li>
                <li>
                  <FiUser />
                  Rakel Moreira
                </li>
              </ul>
            </a>
          </Link>
          <button type='button'>
            Carregando mais posts
          </button>
        </div>

      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType(Prismic.Predicates.at('document.type', 'posts'),
  {
    pageSize: 1,
  });

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_ublication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        substitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = {

    next_page: postsResponse.next_page,
    results: posts, 
  }

  return {
    props: {
      postsPagination,
    }
  }
};
