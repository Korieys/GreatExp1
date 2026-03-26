import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    name?: string;
    type?: string;
    keywords?: string;
    image?: string;
    url?: string;
    schema?: string;
}

export default function SEO({ 
    title, 
    description, 
    name = "Great Expectations", 
    type = "website", 
    keywords,
    image = "https://greatexpectations.clinic/hero.jpg",
    url = "https://greatexpectations.clinic",
    schema
}: SEOProps) {
    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title}</title>
            <meta name='description' content={description} />
            {keywords && <meta name='keywords' content={keywords} />}
            {url && <link rel="canonical" href={url} />}

            {/* Facebook / Open Graph tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {image && <meta property="og:image" content={image} />}
            {url && <meta property="og:url" content={url} />}

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}

            {/* JSON-LD Schema */}
            {schema && <script type="application/ld+json">{schema}</script>}
        </Helmet>
    );
}
