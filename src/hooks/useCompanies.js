import { httpClient } from "../services/httpClient";
import { companiesService } from "../services/companies.service";

export function useCompanies() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {    
        let isActive = true;
        setError(null);

        const load = async () => {
            try {
                setIsLoading(true);
                const res = await companiesService.list();
                if (isActive) setData(res);
            } catch (err) {
                if (isActive) setError(err);
            } finally {
                if (isActive) setIsLoading(false);
            }
        };

        load();
    
        return () => {
          isActive = false;
        };
    }, [companyId]);
    
      return { data, isLoading, error };

}