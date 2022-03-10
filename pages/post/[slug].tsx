import React from 'react'
import type { NextPage, GetStaticProps, GetStaticPaths, GetStaticPathsResult } from 'next'
import { PostDetail, Categories, PostWidget, Author, Comments, CommentsForm, Loader} from '../../components'
import { Params } from 'next/dist/server/router'
import { getPostDetails, getPosts } from '../../services'
import { useRouter } from 'next/router'

const PostDetails: NextPage = ({post}: any) =>  {
  const router = useRouter();

  if(router.isFallback) {
    return <Loader />
  }

  return (
    <div className="container mx-auto px-10 mb-8">
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
        <div className='col-span-1 lg:col-span-8'>
          <PostDetail post={post}/>
          <Author author={post.author}/>
          <CommentsForm slug={post.slug}/>
          <Comments slug={post.slug}/>
        </div>
        <div className='col-span-1 lg:col-span-4'>
          <div className='relative lg:sticky top-8'>
            <PostWidget slug={post.slug} categories={post.categories.map((category: any) => category.slug)}/>
            <Categories />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetails

export const getStaticProps: GetStaticProps = async ({params}: Params) => {
  const data = await getPostDetails(params.slug)

  return {
    props: {post: data},
  }
}

// This is must for a dynamic page
// Next js need to research all posible paths so they can render them statically
export async function getStaticPaths () {
  const posts = await getPosts();

  return {
    paths: posts.map(({node: {slug}}: any) => ({params: {slug}})),
    fallback: true //this is a must
    //set fallback to true to load page after changes, since page is statically generated when deployed
  }
}