import { ClockIcon, HeartIcon } from '@/assets/icons'
import Header from '@/components/Header/Header'
import Navbar from '@/components/Navbar/Navbar'
import SongItem from '@/components/SongItem/SongItem'
import useDominantColor from '@/hooks/useDominantColor'
import { fetchPlaylist } from '@/utils/fetchData'
import classNames from 'classnames/bind'
import React, { useEffect, useState, useContext } from 'react'
import { TbPlayerPlayFilled } from 'react-icons/tb'
import { useLocation } from 'react-router-dom'
import styles from './Playlist.module.scss'
import { useInView } from 'react-intersection-observer'
import Footer from '@/components/Footer/Footer'
import { MainLayoutContext } from '@/contexts/MainLayoutContext'

const cx = classNames.bind(styles)

const Playlist: React.FC = () => {
  const [navOpacity, setNavOpacity] = useState<number>(0)
  const [data, setData] = useState<any>()
  const [isLoading, setLoading] = useState<boolean>(true)
  const { search } = useLocation()
  console.log(search)
  const bgColor = useDominantColor(data?.images[0].url)

  const { width } = useContext(MainLayoutContext)
  console.log(width)

  const { ref, inView } = useInView({
    threshold: 0,
  })
  
  // console.log(data)

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPlaylist(search.substring(1))
      setData(data)
    }
    if (search !== '?undefined') {
      fetchData()
    }
  }, [search])

  useEffect(() => {
    setLoading(Boolean(!data))
  }, [data])

  const handleScroll = (
    e: React.UIEvent<HTMLDivElement, UIEvent>
  ): void => {
    const yAxis = e.currentTarget.scrollTop
    // console.log(yAxis)
    if (yAxis > 64) {
      setNavOpacity(1)
      return
    }
    setNavOpacity(yAxis / 64)
  }

  return (
    <main className={cx('wrapper')}>
      <Navbar navOpacity={navOpacity} bgColor={bgColor} />
      <div onScroll={(e) => handleScroll(e)} className={cx('body')}>
        <Header
          type="Playlist"
          desc={data?.description}
          isLoading={isLoading}
          bgColor={bgColor}
          title={data?.name}
          thumbnail={data?.images[0].url}
          quantity={data?.tracks.total}
        />
        <div className={cx('song-list')}>
          <div
            style={{ backgroundColor: `${bgColor}` }}
            className={cx('bg-blur')}
          ></div>
          <div className={cx('main')}>
            <div className={cx('action-bar')}>
              <button
                className={cx({
                  'play-btn': true,
                })}
              >
                <TbPlayerPlayFilled className={cx('play-btn-child')} />
              </button>
              <button className={cx('heart')}>
                <HeartIcon />
              </button>
            </div>
            <div className={cx('list')}>
              <div
                ref={ref}
                style={{
                  position: 'absolute',
                  top: '-64px',
                  zIndex: '-9',
                }}
              ></div>
              <div
                className={cx({
                  'freeze-top-row': true,
                  stuck: !inView,
                  'grid-md': width <= 780,
                })}
              >
                <div>#</div>
                <div>Title</div>
                <div>Album</div>
                {width > 780 && <div>Date added</div>}
                <div className={cx('clock-icon')}>
                  <ClockIcon />
                </div>
              </div>
              <div className={cx('songs')}>
                {(() => {
                  // console.log(data?.tracks.items, isLoading)
                  let order = 1
                  if (!isLoading) {
                    console.log('im here')
                    return data?.tracks.items.map(
                      (item: any, index: number) => {
                        if (item.track) {
                          return (
                            <SongItem
                              key={index}
                              isLoading={isLoading}
                              songName={item?.track?.name}
                              artist={item?.track?.artists[0]?.name}
                              thumb={item?.track?.album?.images[0]?.url}
                              order={order++}
                              duration={item?.track?.duration_ms}
                              album={item?.track?.album?.name}
                            />
                          )
                        }
                      }
                    )
                  } else {
                    return Array(9)
                      .fill(0)
                      .map((item, index) => (
                        <SongItem
                          isLoading={isLoading}
                          key={item + index}
                        />
                      ))
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  )
}

export default Playlist