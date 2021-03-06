import { format, parseISO } from "date-fns";
import Image from 'next/image'
import Link from 'next/link'
import ptBR from "date-fns/locale/pt-BR";
import { GetStaticProps } from "next";
import { api } from "../services/api";
import { converDurationToTimeString } from "../utils/converDurationToTimeString";

import styles from './home.module.scss';
import { useContext } from "react";
import { PlayerContext } from "../contexts/PlayerContext";

type Episodes = {
  id: string
  title: string
  members: string
  thumbnail: string
  publishedAt: string
  duration: number,
  durationAsString: string,
  description: string
  url: string;
}

type HomeProps ={
  latestEpisodes: Episodes[]
  allEpisodes: Episodes[]
}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {
  const { play } = useContext(PlayerContext);

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        
        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image 
                  src={episode.thumbnail} 
                  width={192} height={192} 
                  alt={episode.title} 
                  objectFit="cover" 
                />

                <div className={styles.episodesDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>
            
                <button type="button" onClick={() => play(episode)}>
                  <img src="/play-green.svg" alt="Play"/>
                </button>
              </li>
            )}
          )}
        </ul>

      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os episodios</h2>
        
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td  style={{width: 72}}>
                    <Image 
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{width: 100}}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button>
                      <img src="/play-green.svg" alt="PLay"/>
                    </button>
                  </td>
                </tr>  
              )
            })}
          </tbody>
        </table>

      </section>
    </div>
  )
}

export const  getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      thumbnail: episode.thumbnail,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
      durationAsString: converDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url
    }
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8 //8 hours
  }
}