import sys
import json
import pyodbc # type: ignore
from datetime import date, time
from decimal import Decimal

def fetch(connectionString, query):
  try:
    conn = pyodbc.connect(connectionString)
    cursor = conn.cursor()
    cursor.execute(query)
    if query.lower().startswith(('create', 'update', 'delete', 'insert')):
      if not conn.autocommit:
        conn.commit()
      print(json.dumps({
        "code": "SUCCESS",
        "message": f"Successfully executed query: {query}",
        "details": f"{cursor.rowcount} row(s) affected"
      }))
      sys.exit(0)
    rows = cursor.fetchall()
    conn.close()
    result = []
    for row in rows:
      row_dict = dict(zip([column[0] for column in cursor.description], row))
      for key, value in row_dict.items():
        if isinstance(value, date):
          row_dict[key] = value.strftime('%Y-%m-%d')
        elif isinstance(value, time):
          row_dict[key] = value.strftime('%H:%M:%S')
        elif isinstance(value, Decimal):
          row_dict[key] = float(value)
        elif isinstance(value, str):
          try:
            json_value = json.loads(value)
            row_dict[key] = json_value
          except json.JSONDecodeError:
            pass
      result.append(row_dict)

    print(json.dumps(result, ensure_ascii=False))
  except Exception as ex:
    if "number of connections exceeds user license" in str(ex):
      print(json.dumps({
        "code": "NUMBER_OF_CONNECTIONS",
        "message": "Number of connections exceeds user license",
        "details": str(ex)
      }), flush=True)
      sys.exit(1)
    print(json.dumps({
      "code": "QUERY_EXECUTION_ERROR",
      "message": "Error while processing query",
      "details": str(ex)
    }), flush=True)
    sys.exit(1)

if __name__ == '__main__':
  try:
    args = json.loads(sys.stdin.read())
    connectionString = args['connectionString']
    query = args['query']
    fetch(connectionString, query)
  except json.JSONDecodeError as ex:
    print(json.dumps({
      "code": "INVALID_INPUT",
      "message": "Error while reading input as JSON",
      "details": str(ex)
    }), flush=True)
    sys.exit(1)
  except Exception as ex:
    print(json.dumps({
      "code": "UNEXPECTED_ERROR",
      "message": "An unexpected error occurred during input processing",
      "details": str(ex)
    }), flush=True)
    sys.exit(1)
