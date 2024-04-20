export const transformData = (apiData) => {
    return apiData.carteTypeCounts.map(item => ({
      statut: item.statut,
      count: item.count
    }));
  };