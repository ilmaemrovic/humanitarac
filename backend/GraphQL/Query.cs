using System.Linq;
using HotChocolate;
using HumanitaracApi.Data;
using HumanitaracApi.Models;

namespace HumanitaracApi.GraphQL
{
    /// GraphQL upiti. Endpoint: /graphql
    /// Primjer: { activities { id title city category date completed } }
    public class Query
    {
        /// Vraća sve humanitarne aktivnosti
        public IQueryable<Activity> GetActivities([Service] HumanitaracDbContext context)
            => context.Activities;
    }
}
