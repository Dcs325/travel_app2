export async function fetchAdzunaJobs({ what, where = '', country = 'us', results_per_page = 5 }) {
  const app_id = import.meta.env.VITE_ADZUNA_APP_ID;
  const app_key = import.meta.env.VITE_ADZUNA_API_KEY;
  const encodedWhat = encodeURIComponent(what);
  const encodedWhere = encodeURIComponent(where);
  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${app_id}&app_key=${app_key}&results_per_page=${results_per_page}&what=${encodedWhat}&where=${encodedWhere}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch Adzuna jobs');
    const data = await response.json();
    return data.results || [];
  } catch (err) {
    console.error('Adzuna API error:', err);
    return [];
  }
} 