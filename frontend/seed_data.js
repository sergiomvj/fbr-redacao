const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Erro: SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontrados no .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
    console.log("🚀 Iniciando Seed de Dados...");

    // 1. Regiões (Garantir que existem) - Usando SLUG para evitar conflito se ID mudar
    console.log("Criando regiões...");
    const { data: regions, error: regError } = await supabase
        .from('regions')
        .upsert([
            { name: 'Flórida', slug: 'florida-us', type: 'state', is_active: true },
            { name: 'São Paulo', slug: 'sao-paulo-br', type: 'state', is_active: true },
        ], { onConflict: 'slug' })
        .select();

    if (regError) {
        console.error("Erro ao criar regiões:", regError);
        return;
    }

    const floridaId = regions.find(r => r.slug === 'florida-us').id;
    const spId = regions.find(r => r.slug === 'sao-paulo-br').id;

    // Sub-regiões
    const { data: subRegions, error: subRegError } = await supabase
        .from('regions')
        .upsert([
            { name: 'Orlando', slug: 'orlando-fl', type: 'city', parent_id: floridaId, is_active: true },
            { name: 'Miami', slug: 'miami-fl', type: 'city', parent_id: floridaId, is_active: true },
        ], { onConflict: 'slug' })
        .select();

    if (subRegError) {
        console.error("Erro ao criar sub-regiões:", subRegError);
    }

    const orlandoId = subRegions.find(r => r.slug === 'orlando-fl').id;
    const miamiId = subRegions.find(r => r.slug === 'miami-fl').id;

    console.log("✅ Regiões criadas.");

    // 2. Fontes (Sources)
    console.log("Criando fontes...");
    const { data: sources, error: srcError } = await supabase
        .from('sources')
        .upsert([
            { name: 'Orlando Sentinel RSS', type: 'rss', url: 'https://www.orlandosentinel.com/arcio/rss/', region_id: orlandoId, is_active: true },
            { name: 'Miami Herald News', type: 'url', url: 'https://www.miamiherald.com/', region_id: miamiId, is_active: true },
            { name: 'G1 São Paulo', type: 'rss', url: 'https://g1.globo.com/rss/sp/sao-paulo/', region_id: spId, is_active: true },
        ], { onConflict: 'url' })
        .select();

    if (srcError) console.error("Erro ao criar fontes:", srcError);
    else console.log("✅ Fontes de dados criadas.");

    // 3. Agentes
    console.log("Criando agentes...");
    const { data: agents, error: agtError } = await supabase
        .from('agents')
        .upsert([
            { name: 'Collector Alpha', type: 'collector', status: 'online', region_id: floridaId, llm_provider: 'gpt4o' },
            { name: 'Journalist BR', type: 'journalist', status: 'online', region_id: spId, llm_provider: 'claude' },
            { name: 'Art Vision', type: 'art', status: 'online', llm_provider: 'gpt4o' },
            { name: 'Regional Editor US', type: 'regional_editor', status: 'online', region_id: floridaId, llm_provider: 'gpt4o' },
        ], { onConflict: 'name' })
        .select();

    if (agtError) console.error("Erro ao criar agentes:", agtError);
    else console.log("✅ Agentes de IA criados.");

    // 4. Matérias (Articles) em diferentes estágios
    console.log("Criando matérias...");
    const { error: artError } = await supabase
        .from('articles')
        .upsert([
            {
                title: 'Nova nevasca atinge o norte da Flórida',
                body: 'Autoridades alertam para temperaturas recordes e neve em áreas incomuns na Panhandle.',
                status: 'collecting',
                region_id: floridaId,
                category: 'Clima',
                slug: 'nevasca-florida-' + Date.now()
            },
            {
                title: 'Festival de Inverno em Orlando atrai milhares',
                body: 'O evento anual começou ontem no Lake Eola com diversas atrações para toda a família.',
                status: 'writing',
                region_id: orlandoId,
                category: 'Cultura',
                slug: 'festival-inverno-' + Date.now()
            },
            {
                title: 'Trânsito na Marginal Tietê bate recorde histórico',
                body: 'Com as chuvas da tarde, a cidade de São Paulo registrou 250km de lentidão nas principais vias.',
                status: 'art_review',
                region_id: spId,
                category: 'Trânsito',
                slug: 'transito-marginal-' + Date.now()
            },
            {
                title: 'Novos voos diretos Miami-Lisboa começam em Junho',
                body: 'A companhia aérea anunciou três frequências semanais operadas por Airbus A330 saindo do MIA.',
                status: 'regional_review',
                region_id: miamiId,
                category: 'Turismo',
                slug: 'voos-miami-lisboa-' + Date.now()
            },
            {
                title: 'Guia de Gastronomia Brasileira em Orlando',
                body: 'Descubra os melhores lugares para comer feijoada e coxinha na Terra do Mickey durante suas férias.',
                status: 'published',
                region_id: orlandoId,
                category: 'Gastronomia',
                slug: 'guia-gastronomia-' + Date.now()
            }
        ]);

    if (artError) console.error("Erro ao criar matérias:", artError);
    else console.log("✅ Matérias de teste criadas.");

    console.log("✨ Seed finalizado com sucesso!");
}

seed();
