from core.database import get_supabase_service_auth

def seed_data():
    supabase = get_supabase_service_auth()
    
    # We need to ensure we have a valid region_id from the database
    regions = supabase.table('regions').select('id').limit(1).execute()
    if not regions.data:
        print("Creating a default region...")
        res = supabase.table('regions').insert({'name': 'Boston', 'slug': 'bos', 'description': 'Boston Region'}).execute()
        region_id = res.data[0]['id']
    else:
        region_id = regions.data[0]['id']

    articles_data = [
        {
            'title': 'Prefeito de Boston anuncia novo fundo de apoio',
            'slug': 'fundo-prefeito-boston',
            'body': 'A nova dotação orçamentária visa fortalecer pequenos negócios locais...',
            'status': 'collecting',
            'category': 'news',
            'region_id': region_id
        },
        {
            'title': 'Como o novo centro comunitário afetará a região leste',
            'slug': 'centro-comunitario-leste',
            'body': 'Moradores estão divididos sobre o impacto no trânsito...',
            'status': 'writing',
            'category': 'local',
            'region_id': region_id
        },
        {
            'title': 'Clima Extremo: Cuidados para dirigir na neve',
            'slug': 'clima-extremo-neve',
            'body': 'As autoridades alertam para a forte nevasca prevista para este sábado...',
            'status': 'regional_review',
            'category': 'weather',
            'region_id': region_id
        }
    ]

    print("Inserting mock articles...")
    response = supabase.table('articles').insert(articles_data).execute()
    print("Inserted!")

if __name__ == "__main__":
    seed_data()
