using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Authority.DAL
{
    public class CommonDAL
    {
        /// <summary>
        /// 批量导入
        /// </summary>
        /// <param name="conn"></param>
        /// <param name="dt"></param>
        /// <param name="tran"></param>
        public static void BulkCopy(SqlConnection conn, DataTable dt, SqlTransaction tran = null)
        {
            if (dt == null)
            {
                return;
            }
            var bulkCopy = tran == null ? new SqlBulkCopy(conn) : new SqlBulkCopy(conn, SqlBulkCopyOptions.Default, tran);
            using (bulkCopy)
            {
                bulkCopy.DestinationTableName = dt.TableName;
                foreach (DataColumn dc in dt.Columns)
                {
                    bulkCopy.ColumnMappings.Add(dc.ColumnName, dc.ColumnName);
                }
                bulkCopy.WriteToServer(dt);
            }
        }

        public static void BulkToDB(DataTable dt, SqlConnection sqlConn, SqlTransaction tran = null)
        {
            SqlBulkCopy bulkCopy = tran == null ? new SqlBulkCopy(sqlConn) : new SqlBulkCopy(sqlConn, SqlBulkCopyOptions.Default, tran);
            bulkCopy.ColumnMappings.Add("EmpCode", "EmpCode");
            bulkCopy.ColumnMappings.Add("PlatForm", "PlatForm");
            bulkCopy.ColumnMappings.Add("CityID", "CityID");
            bulkCopy.ColumnMappings.Add("DepartOnlyCode", "DepartOnlyCode");
            bulkCopy.ColumnMappings.Add("ModDate", "ModDate");
            bulkCopy.ColumnMappings.Add("Modifier", "Modifier");
            bulkCopy.ColumnMappings.Add("IsDel", "IsDel");
            bulkCopy.ColumnMappings.Add("Creator", "Creator");
            bulkCopy.ColumnMappings.Add("CreateDate", "CreateDate");
            bulkCopy.DestinationTableName = "Priv_Employee_Data";
            bulkCopy.BatchSize = dt.Rows.Count;
            if (sqlConn.State == ConnectionState.Closed)
            {
                sqlConn.Open();
            }
            if (dt != null && dt.Rows.Count != 0)
            {
                bulkCopy.WriteToServer(dt);
            }
        }
        public static DataTable GetTableSchema()
        {
            DataTable dt = new DataTable();
            dt.Columns.AddRange(new DataColumn[]{
        new DataColumn("EmpCode",typeof(int)),
        new DataColumn("PlatForm",typeof(int)),
    new DataColumn("CityID",typeof(int)),
    new DataColumn("IsDel",typeof(int)),
    new DataColumn("DepartOnlyCode",typeof(int)),
    new DataColumn("Creator",typeof(int)),
    new DataColumn("Modifier",typeof(int)),
    new DataColumn("ModDate",typeof(DateTime)),
    new DataColumn("CreateDate",typeof(DateTime))
            });
            return dt;
        }

    }
}
