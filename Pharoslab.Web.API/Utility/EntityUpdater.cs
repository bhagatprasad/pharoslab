using System.Reflection;

namespace Pharoslab.Web.API.Utility
{
    public class EntityUpdater
    {
        public static bool HasChanges<T>(T existingEntity, T incomingEntity, params string[] excludedProperties)
        {
            var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                      .Where(p => !excludedProperties.Contains(p.Name))
                                      .ToList();

            foreach (var property in properties)
            {
                var existingValue = property.GetValue(existingEntity);
                var incomingValue = property.GetValue(incomingEntity);

                if (!object.Equals(existingValue, incomingValue))
                {
                    return true;
                }
            }
            return false;
        }

        public static void UpdateProperties<T>(T existingEntity, T incomingEntity, params string[] excludedProperties)
        {
            var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                      .Where(p => !excludedProperties.Contains(p.Name))
                                      .ToList();

            foreach (var property in properties)
            {
                var incomingValue = property.GetValue(incomingEntity);
                property.SetValue(existingEntity, incomingValue);
            }
        }
    }
}
