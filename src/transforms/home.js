import Services from '@/services/home';

export function getData(data, dataOptions) {
  const request = payload => ({});
  const response = payload => ({});

  return Services.getData(request(data), dataOptions).then(response);
}
