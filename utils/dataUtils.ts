import { Article } from '../types';

declare const XLSX: any;

export const processRawData = (rawData: any[]): Article[] => {
  return rawData.map((row, index) => {
    const cleanedRow: any = {};
    Object.keys(row).forEach(key => {
      const val = row[key];
      cleanedRow[key] = typeof val === 'string' ? val.trim() : val;
    });

    const onlineFirstDate = cleanedRow.online_first_date;
    let formattedDate = 'N/A';
    
    if (onlineFirstDate) {
      let date: Date;
      if (typeof onlineFirstDate === 'number') {
        date = new Date((onlineFirstDate - 25569) * 86400 * 1000);
      } else {
        date = new Date(onlineFirstDate);
      }
      if (!isNaN(date.getTime())) {
        formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      }
    }

    const fullAuthor = `${cleanedRow.author_given_name || ''} ${cleanedRow.Author_family_name || ''}`.trim() || 'Unknown Author';

    return {
      ...cleanedRow,
      id: `art-${index}-${Date.now()}`,
      fullAuthor,
      formattedDate,
      selected: false,
      downloaded: false,
      topic: 'Uncategorized'
    } as Article;
  });
};

export const exportToExcel = (articles: Article[]) => {
  // We exclude 'topic' here because it's for internal curation only
  const exportData = articles.filter(a => a.selected).map(a => ({
    'Author': a.fullAuthor,
    'Title': a.article_title,
    'Rubric': a.rubric || '',
    'Status': a.production_state || '',
    'Online First': a.formattedDate,
    'DOI': a.doi,
    'MS Number': a.editorial_ms_number || '',
    'Pages': a.article_last_page || '',
    'Notes': a.notes_on_issue_building || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Issue_Plan");
  XLSX.writeFile(workbook, `Editorial_Plan_${new Date().toISOString().split('T')[0]}.xlsx`);
};