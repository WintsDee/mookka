
export function filterAdultContent(data: any, type: string) {
  if (type === 'book' && data.items) {
    const adultContentKeywords = [
      'xxx', 'erotic', 'érotique', 'porn', 'porno',
      'pornographique', 'bdsm', 'kamasutra', 'explicit', 'explicite'
    ];
    
    data.items = data.items.filter((item: any) => {
      const title = (item.volumeInfo?.title || '').toLowerCase();
      const description = (item.volumeInfo?.description || '').toLowerCase();
      const contentText = `${title} ${description}`;
      return !adultContentKeywords.some(keyword => contentText.includes(keyword));
    });
  }
  return data;
}
